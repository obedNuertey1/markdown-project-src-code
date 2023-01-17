import * as fs from 'fs';

const stringText = fs.readFileSync('../marked.md', 'utf8').toString();

export default stringText;