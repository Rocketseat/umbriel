import { Readable } from 'stream';
import csvParse from 'csv-parse';

export default function parseCSVAsync(fileStream: Readable): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const result: string[] = [];

    const parsers = csvParse({
      delimiter: ';',
    });

    const parseCSV = fileStream.pipe(parsers);

    parseCSV.on('data', (line: string[]) => result.push(...line));

    parseCSV.on('end', () => resolve(result));

    parseCSV.on('error', reject);
  });
}
