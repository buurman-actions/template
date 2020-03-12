import { fileTemplate, pathTemplate } from "buurman-utils";
import { mkdirp, pathExists, readFile, writeFile } from "fs-extra";
import { dirname, isAbsolute, join, relative } from "path";
import readdir from "recursive-readdir";
export const run = async (context, { source, variables, destination, overwrite }) => {
    destination = isAbsolute(destination)
        ? destination
        : join(process.cwd(), destination);
    const processPath = pathTemplate(variables);
    const tpl = fileTemplate(variables);
    const templateRoot = isAbsolute(source)
        ? // source is absolute, ignore context.path
            source
        : // source is relative,
            // join context.path (or cwd if not provided) with source
            join(context.path || process.cwd(), source);
    const files = await readdir(templateRoot);
    for (const path of files) {
        const dest = join(destination, relative(templateRoot, path));
        const filePath = processPath(dest);
        await mkdirp(dirname(filePath));
        if (!overwrite && (await pathExists(filePath))) {
            continue;
        }
        await writeFile(filePath, tpl(await readFile(path, "utf-8")));
    }
};
