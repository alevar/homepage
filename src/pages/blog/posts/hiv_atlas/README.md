---
id: hiv_atlas
title: The Missing Reference: How HIV Atlas Brings Modern Genomics to HIV Research
date: 2025-10-01
summary: After decades without a standard reference, HIV Atlas delivers the first consolidated annotation of HIV-1 splicing diversity, enabling accurate RNA-seq analysis across the HIV/SIV pangenome.
draft: true
---

# Intro

Much of my interest in biology originated from learning more about viruses. The efficiency with which information was encoded by their genetic material and utilizing host machineries all while maintaining resilience to external factors and maintaining its ability to evolve faster than any other known genetic things tickled my brain which was already at the time preoccupied with toughts of computational efficiency in computer science and the perhaps slightly naive ideas about biological computing after reading about dna computing from 90s and early 2000s.

Fast forward to the start of my career in genomics in 2017 and once of the first projects I was involved in, was analyzing single-cell RNA-seq data of hiv-1 infected cells and searching for signs of chimeric transcripts. In short, when HIV-1 invades the hosts cell, it utilizes ... to insert its genetic material into the host genome, thus staying latent for years, copying itself with each cellular division, until some event triggers its expression and the replication cycle resume with new rigor.

Following a standard protocol for RNA-seq analysis, the reads were mapped with HISAT2 to the HIV-1 gneome (the HXB2 reference genome to be specific). We quickly identified several candidate chimeras with clean read fragments supporting the chimeric junction on both host and pathogen sides. Having shared these results with our collaborators, they were extremely excited, especially about a few cases for which the chimeric junction lay right at donor/acceptor sites of host and virus. It is then that I first learned about the true complexity of the HIV-1 genome, with multiple alternatively-spliced transcripts for each gene, reminiscent of some truly complex human protein-coding loci.

However, to my surprise, the analysis and matching of donors and acceptors was done manually, by eye-balling the matching between the donors and acceptors. Even to my untrained eye at the start of my genomics journey, this felt a bit odd, considering by that point I have already seen numerous studies examining splicing dynamics of HIV-1. It seemed particularly odd, considering the hypermutable nature of the virus, and the clear advantages to the alignment and quantification benefits guide annotation could provide. Another point of note that stood out to me, that while I was routinely asked to perform transcriptome assembly of human RNA-seq data, it seemed odd the same was not routinely examined in the HIV RNA-seq data.

Fast forward many years, and I was contacted by now close colleagues to help address reviewer comments by replciating our chimeric inference protocol on another dataset. Given the unique and deep nature of the dataset, this investigation very quickly spilled into a full fledged separate study of chimerism during acute stages of the viremia. The significantly greater sequencing depth resulting, larger number of samples and the full-length isoform length of the SMART seq data allowed for an unprecedented look into the transcriptional dynamics of the virus biology. At the same time, the same properties made the previous manual analysis considerably less feasible and demanded utilities for new type of analysis. Having not done work on HIV for a few years at this point, I was even more surprised to find not a single reference transcriptome annotation of the HIV-1 or SIV virus out there. WHile many new studies came out analyzing the transcriptome, especially with longer sequencing becoming increasingly more popular, I was surprised this type of resource simply didn't exist.

Since this time around we had a lot of data and time, and my experience in building genome annotations from experimental and manual data, I thought why not give it a try and see where things go.

# Gathering preliminary data

Unsurprisingly, splicing has been widely characterized in HIV. records dating to the 80s have extensively detailed

## References

