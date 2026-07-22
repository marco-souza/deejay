import browser from "webextension-polyfill";

export type TabSongData = {
  title: string;
  description: string;
  cover: string;
  url: string;
};

function isYouTubeUrl(url: string): boolean {
  const host = new URL(url).hostname;
  return (
    host === "www.youtube.com" ||
    host === "youtube.com" ||
    host === "music.youtube.com"
  );
}

export async function isActiveTabYouTube(): Promise<boolean> {
  try {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    console.log({ tabs });

    const url = tabs[0]?.url;
    console.log({ url });

    return !!url && isYouTubeUrl(url);
  } catch (error) {
    console.error("Failed to check active tab:", error);
    return false;
  }
}

function extractYouTubeData(): TabSongData {
  const description =
    document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content") ?? "";
  const cover =
    document
      .querySelector('meta[property="og:image"]')
      ?.getAttribute("content") ?? "";

  return {
    title: document.title.replace(/ - YouTube$/, ""),
    description,
    cover,
    url: window.location.href,
  };
}

export async function getActiveTabSongData(): Promise<TabSongData | null> {
  try {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const tab = tabs[0];
    if (!tab?.id || !tab.url || !isYouTubeUrl(tab.url)) {
      return null;
    }

    const results = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractYouTubeData,
    });

    return results[0]?.result ?? null;
  } catch (error) {
    console.error("Failed to read active tab data:", error);
    return null;
  }
}
