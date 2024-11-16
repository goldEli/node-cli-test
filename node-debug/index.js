const fs = require('fs/promises');

(async () => {
    // 运行路径
    const cwd = process.cwd();

    const fileContent = await fs.readFile('./package.json', {
        encoding: 'utf8',
    });
    console.log(fileContent);

    await fs.writeFile('./package2.json', fileContent)
})();