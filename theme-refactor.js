const fs = require('fs');
const path = require('path');

const directories = ['app', 'components', 'services'];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Direct token mappings
    content = content.replace(/text-purple-\d+/g, 'text-primary');
    content = content.replace(/text-indigo-\d+/g, 'text-primary');
    content = content.replace(/text-pink-\d+/g, 'text-accent');
    content = content.replace(/text-violet-\d+/g, 'text-primary');

    content = content.replace(/bg-purple-\d+/g, 'bg-primary');
    content = content.replace(/bg-indigo-\d+/g, 'bg-primary');
    content = content.replace(/bg-pink-\d+/g, 'bg-accent');
    content = content.replace(/bg-violet-\d+/g, 'bg-primary');

    content = content.replace(/border-purple-\d+/g, 'border-primary');
    content = content.replace(/border-indigo-\d+/g, 'border-primary');
    content = content.replace(/border-pink-\d+/g, 'border-accent');
    content = content.replace(/border-violet-\d+/g, 'border-primary');

    content = content.replace(/ring-purple-\d+/g, 'ring-primary');
    content = content.replace(/ring-indigo-\d+/g, 'ring-primary');
    content = content.replace(/ring-pink-\d+/g, 'ring-accent');
    content = content.replace(/ring-violet-\d+/g, 'ring-primary');

    content = content.replace(/from-indigo-\d+/g, 'from-primary');
    content = content.replace(/via-purple-\d+/g, 'via-secondary');
    content = content.replace(/to-pink-\d+/g, 'to-accent');
    
    content = content.replace(/from-purple-\d+/g, 'from-primary');
    content = content.replace(/via-pink-\d+/g, 'via-accent');
    
    // Hardcoded hex colors
    content = content.replace(/#8B5CF6/ig, 'var(--primary)');
    content = content.replace(/#6366F1/ig, 'var(--primary)');
    content = content.replace(/#EC4899/ig, 'var(--accent)');
    content = content.replace(/#4f46e5/ig, 'var(--primary)');
    content = content.replace(/#9333ea/ig, 'var(--secondary)');

    // Specific hover states
    content = content.replace(/hover:bg-purple-\d+/g, 'hover:bg-primary-hover');
    content = content.replace(/hover:bg-indigo-\d+/g, 'hover:bg-primary-hover');
    content = content.replace(/hover:text-purple-\d+/g, 'hover:text-primary-hover');
    content = content.replace(/hover:text-indigo-\d+/g, 'hover:text-primary-hover');

    // Muted variants
    content = content.replace(/bg-purple-\d+\/10/g, 'bg-primary/10');
    content = content.replace(/bg-indigo-\d+\/10/g, 'bg-primary/10');
    content = content.replace(/bg-pink-\d+\/10/g, 'bg-accent/10');

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    }
}

directories.forEach(dir => processDirectory(path.join(__dirname, dir)));
console.log('Migration complete.');
