import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver';

const LOG_DIR = path.join(__dirname, '..', '..', 'logs');
const BACKUP_DIR = path.join(__dirname, '..', '..', 'logs', 'backup');

export async function archiveOldLogs(keepDays = 14) {
  const files = fs.readdirSync(LOG_DIR).filter(file => file.endsWith('.log'));
  const now = new Date();

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
  }

  for (const file of files) {
    const filePath = path.join(LOG_DIR, file);
    const stats = fs.statSync(filePath);
    const fileAgeDays = (now.getTime() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

    if (fileAgeDays > keepDays) {
      const zip = archiver('zip', { zlib: { level: 9 } });
      const output = fs.createWriteStream(path.join(BACKUP_DIR, `${file}.zip`));

      zip.pipe(output);
      zip.file(filePath, { name: file });
      await zip.finalize();

      console.log(`✅ Backed up and zipped: ${file}`);
      fs.unlinkSync(filePath);
    }
  }
}
