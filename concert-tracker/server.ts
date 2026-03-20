import express, { Request, Response } from 'express';
import path from 'path';
import { scrapeAll } from './scrapers/index';

const app = express();
const PORT = process.env.PORT || 3456;

// Serve static files from public directory
// When running with ts-node, __dirname is the root; when compiled, it's dist/
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('/api/concerts', async (req: Request, res: Response) => {
  const forceRefresh = req.query.refresh === '1';
  try {
    const data = await scrapeAll(forceRefresh);
    res.json({ ok: true, ...data });
  } catch (err) {
    console.error('scrapeAll error:', err);
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ ok: false, error: message });
  }
});

app.listen(PORT, () => {
  console.log(`Concert Tracker running → http://localhost:${PORT}`);
});
