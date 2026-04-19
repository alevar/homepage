export interface GitCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
}

const OWNER = 'alevar';
const REPO = 'homepage';

export const fetchRecipeCommits = async (recipeId: string): Promise<GitCommit[]> => {
  const path = `src/pages/recipes/${recipeId}/README.md`;
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/commits?path=${encodeURIComponent(path)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 403 || response.status === 404) {
        // Fallback for API limits or local dev testing
        return [];
      }
      throw new Error(`GitHub API returned ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch recipe commits:', err);
    return [];
  }
};

export const fetchRecipeContentAtSha = async (recipeId: string, sha: string): Promise<string | null> => {
  const path = `src/pages/recipes/${recipeId}/README.md`;
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}?ref=${sha}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (data.content && data.encoding === 'base64') {
      // Browser atob to decode base64 utf-8 safely
      const binaryString = atob(data.content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new TextDecoder().decode(bytes);
    }
    return null;
  } catch (err) {
    console.error(`Failed to fetch recipe content at SHA ${sha}:`, err);
    return null;
  }
};
