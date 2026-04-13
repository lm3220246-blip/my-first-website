export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "只支持 POST 请求" });
  }

  try {
    const { question } = req.body || {};

    if (!question) {
      return res.status(400).json({ error: "问题不能为空" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "你是一个耐心、直接、适合新手的AI学习与网页开发助手。回答要清楚、实用、少讲空话。"
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: data?.error?.message || "OpenAI 接口调用失败"
      });
    }

    const answer = data.choices?.[0]?.message?.content || "没有获取到回答。";

    return res.status(200).json({ answer });
  } catch (error) {
    return res.status(500).json({ error: "服务器出错了，请稍后再试。" });
  }
}
