---
id: rna_sample_clustering
title: Exploring RNA-seq Sample Clustering from Raw Data
date: 2025-10-08
summary: How well does kmer composition of RNA-seq samples correlate with metadata
---

# Exploring RNA-seq Sample Clustering from Raw Data

## Idea

Continuing what’s by now become my yearly tradition of using the holidays between November and January to explore some entirely new side project — this one came a bit early. Last year, I looked into how the proportion of transcriptomic multimappers reported by traditional aligners (which are computationally constrained and can only realistically report a limited number) affects downstream quantification with **Salmon** — [read that post here](https://alevar.github.io/homepage/blog/salmon_multimappers). This year’s little expedition seems to have arrived early — or maybe I’ll wrap this one up before Christmas and start something else. Either way, I’ll be updating this post as I proceed with running the experiments outlined below.

Identifying erroneous splicing events from RNA-seq data is much more informative in groups of samples that share similar transcriptional landscapes. True events are amplified within such groups, while noise tends to be randomly distributed. The separation grows as sample size increases.

The opposite happens when samples come from a mix of tissues, cell types, or other sources. With less overlap in true signal, the effects get diluted, and separation between real and noise signals shrinks.

Unfortunately, metadata is not always accurate or available. For example, GTEx samples labeled as *Thyroid* might be relatively homogeneous, but *Skin* or *Brain* tissues are far more heterogeneous, containing many transcriptionally distinct subtypes. That heterogeneity limits the benefits of multi-sample analyses.

While methods exist to infer sample origins (e.g., cell labeling for single-cell data or cell-line grouping for bulk), these approaches operate on *already processed* data — after alignment, quantification, normalization, and so on. But those very preprocessing steps depend on accurate knowledge of sample relationships in the first place.

So we end up with a circular problem:  
we need expression levels to cluster samples, but we need to know the sample origins to get accurate expression levels.  
Or do we?

This little investigation aims to explore whether sample relatedness can be measured **directly from raw data**, how well it correlates with metadata, and whether clustering on raw reads can improve downstream analyses.

---

## Setup

### Sample Selection

First, I need to decide what data to use. Fortunately, I have access to the 20,000 well-documented bulk RNA-seq samples from the **GTEx** consortium. They can be filtered by annotated features like sex, age, body site, tissue type, and more.

For this experiment, I’ll probably start with two relatively homogeneous but distinct tissue groups and test whether clustering based on raw or aligned reads can distinguish them. It would also be interesting to include a highly heterogeneous tissue (like skin or brain) to see whether clustering on raw data can decompose it into meaningful subgroups.

Coincidentally, my first first-author project [4] actually involved building a **simulated RNA-seq dataset** — not just simulating experiments, but entire tissues and samples. That might be a fun strategy to revisit here: test the same hypothesis on simulated data and see how well it captures real transcriptional dynamics.

---

### Computing Sample Representations

The next step — and probably the most impactful for downstream results — is computing sample representations.

Clustering methods (especially in single-cell and spatial transcriptomics) already operate on transcript or gene quantifications. But, as we established before, quantification accuracy depends heavily on earlier steps. Two points in the workflow that come before quantification — **raw reads** and **alignments** — might already hold enough information for clustering.

In theory, we could even improve alignments by incorporating sample relatedness. Tools like **HISAT2** already use a two-pass strategy: it first scans a subset of reads to find potential junctions, then uses those junctions to guide the full alignment. Extending that idea across multiple samples might further improve accuracy. Imagine aggregating splicing signals across samples, feeding those into the aligner, and re-aligning with heavier weights on shared junctions.

That said, for now I’ll keep things simple and treat raw and aligned reads as unbiased inputs for clustering — and see whether the alignment step actually adds any benefit.

Now that we laid out the general framework, let's talk about how we can compute the sample representations themselves.

---

#### K-mer Counting from Raw Data

K-mer counting is one of the oldest and simplest ideas in genomics: count how many times each substring of length *k* appears in the data. The concept is easy; doing it efficiently and meaningfully is the hard part.

Fortunately, thanks to the countless applications of kmer counting in genomics, decades of research have been poured into the develoopment of now well-established and highly optimized algorithms. For example, **Sourmash** uses **FracMinHash** sketching to create lightweight “signatures” of large datasets.

The *Sourmash v4* paper [2] notes that:

> “FracMinHash provides a lightweight way to store representations of large DNA or RNA sequence collections for comparison and search... accurate even for data sets of very different sizes.”

Which is exactly what is needed for the experiment at hand. In fact, the original *Sourmash* paper [3] demonstrated this idea on RNA-seq data, showing that k-mer sketches separated wild-type and mutant *S. cerevisiae* samples in MDS space — results that closely mirrored traditional quantification-based clustering from **Salmon**.

So that’s where I’ll start.

---

#### Transcriptional Landscapes from Aligned Reads

Alternatively, once reads are aligned, we can represent samples in several ways:

- Normalize genome coverage across fixed bins or windows.
- Extract and normalize splice junction coverage only.
- Combine multiple coverage-based or junction-based features for comparison.

---

#### Transcriptional Landscapes from Raw Data

Last but not least, what if we skip alignment altogether and extract transcriptional landscapes directly from raw reads?

Conceptually, this isn’t too far-fetched. Build a hash table of k-mers mapped to genomic positions (assuming we’re not in a metagenomic setting), then query raw reads to estimate genome-wide coverage. That’s essentially what pseudoalignment tools like **Salmon** and **Kallisto** do.

Now that I think about it, we could even estimate junction coverage from *split k-mers*:  
if two k-mers from the same read appear at distance *D* apart in the read but *J* apart in the genome, and `|J - D| > 100 bp`, we can infer a structural variant or splice junction.

---
## Applications to Single-Cell Data

While my current focus for this project lies in **bulk RNA-seq** data processing, the applications to **single-cell** datasets deserve separate acknowledgment. Sample clustering is both a foundational step and often the interpretational goal of scRNA-seq studies. However, as mentioned above, clustering is typically performed *after* gene expression has been quantified — and those estimates, especially in sparse datasets, can be heavily influenced by the preprocessing pipeline. A more measured **multi-sample approach** to the analysis of single-cell data, informed by *pre-clustering of samples* or pooled representations prior to quantification, might offer a valuable opportunity to improve the robustness and accuracy of downstream analyses.

---

## Conclusion

The plan for now is to start simple — replicate the **Sourmash** approach using more than two tissue groups, on both real GTEx and simulated data.  

A similar idea was tested by **Kaisers et al.** [1], who showed that k-mer composition of RNA-seq reads can identify batch effects through hierarchical clustering. Once initial results are in, I’ll compare this to alignment-based and pseudoalignment-based methods.

I’m sure plenty of unforeseen caveats will creep in along the way — they always do.

---

## References

1. **Kaisers, W., Schwender, H., & Schaal, H.** (2018). Hierarchical clustering of DNA k-mer counts in RNAseq Fastq files identifies sample heterogeneities. *Int. J. Mol. Sci.*, 19(11), 3687.  
2. **Irber, L., Pierce-Ward, N. T., Abuelanin, M., Alexander, H., Anant, A., Barve, K., ... & Brown, C. T.** (2024). *sourmash v4: A multitool to quickly search, compare, and analyze genomic and metagenomic data sets.* *JOSS*, 9(98), 6830.  
3. **Pierce, N. T., Irber, L., Reiter, T., Brooks, P., & Brown, C. T.** (2019). Large-scale sequence comparisons with sourmash. *F1000Research*, 8, 1006.  
4. **Varabyou, A., Salzberg, S. L., & Pertea, M.** (2021). Effects of transcriptional noise on estimates of gene and transcript expression in RNA sequencing experiments. *Genome Research*, 31(2), 301–308.
