let classifier: any = null;
let loading = false;
let loaded = false;

const TOXICITY_THRESHOLD = 0.65;
const TOXIC_LABELS = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"];

async function loadModel() {
  if (loaded || loading) return;
  loading = true;
  try {
    const { env, pipeline } = await import("@xenova/transformers");
    const remoteHost = process.env.TRANSFORMERS_REMOTE_HOST?.trim();
    if (remoteHost) {
      env.remoteHost = remoteHost.endsWith("/") ? remoteHost : `${remoteHost}/`;
    }
    if (process.env.TRANSFORMERS_CACHE?.trim()) {
      env.cacheDir = process.env.TRANSFORMERS_CACHE.trim();
    }
    console.log("正在加载AI审核模型（首次需要下载，约40MB）...");
    classifier = await pipeline("text-classification", "Xenova/toxic-bert", {
      quantized: true,
    });
    loaded = true;
    console.log("AI审核模型加载完成");
  } catch (error) {
    console.error("AI审核模型加载失败，将使用基础敏感词过滤:", error);
  } finally {
    loading = false;
  }
}

loadModel();

export interface ModerationResult {
  safe: boolean;
  reason?: string;
  scores?: Record<string, number>;
}

export async function aiModerate(text: string): Promise<ModerationResult> {
  if (!classifier) {
    return { safe: true };
  }

  try {
    const results = await classifier(text, { topk: 6 });

    const flat = Array.isArray(results[0]) ? results[0] : results;

    const scores: Record<string, number> = {};
    for (const r of flat) {
      scores[r.label] = r.score;
    }

    for (const label of TOXIC_LABELS) {
      const score = scores[label];
      if (score !== undefined && score > TOXICITY_THRESHOLD) {
        return {
          safe: false,
          reason: "AI审核：内容可能包含不当言论",
          scores,
        };
      }
    }

    return { safe: true, scores };
  } catch (error) {
    console.error("AI审核出错:", error);
    return { safe: true };
  }
}
