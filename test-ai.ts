import * as fs from 'fs';
import { analyzeIssueImage } from './services/ai.service';
import { File } from 'buffer';

async function test() {
  // Mock FormData
  const imgPath = 'C:/Users/syeda/.gemini/antigravity-ide/brain/c743001c-80af-463e-87f2-ddd6f49f9932/pothole_test_1782638430217.png';
  const imgBuffer = fs.readFileSync(imgPath);
  const file = new File([imgBuffer], "pothole.png", { type: "image/png" });
  
  const formData = new FormData();
  formData.append('image', file as any);
  
  try {
    const result = await analyzeIssueImage(formData);
    console.log("SUCCESS:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("ERROR:", err);
  }
}

test();
