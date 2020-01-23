import { Readable } from 'stream';
import csvParse from 'csv-parse';

export default function parseCSVAsync(
  fileStream: Readable,
  eachLine?: (...line: string[]) => Promise<void> | void,
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const result: string[] = [];

    const parsers = csvParse({
      delimiter: ';',
    });

    const parseCSV = fileStream.pipe(parsers);

    parseCSV.on('data', async (line: string[]) => {
      result.push(...line);

      await eachLine?.(...line);
    });

    parseCSV.on('end', () => resolve(result));

    parseCSV.on('error', reject);
  });
}
