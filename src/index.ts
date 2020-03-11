import { Action, fileTemplate, InputValues, pathTemplate } from "buurman-utils";
import { mkdirp, readFile, writeFile } from "fs-extra";
import { dirname, isAbsolute, join, relative } from "path";
import readdir from "recursive-readdir";

export interface Inputs extends InputValues {
    source: string;
    destination: string;
    variables: object;
}

export const run: Action<Inputs> = async (
    context,
    { source, variables, destination },
) => {
    destination = isAbsolute(destination)
        ? destination
        : join(process.cwd(), destination);

    const processPath = pathTemplate(variables);
    const tpl = fileTemplate(variables);

    if (!context.path) {
        throw new Error(
            `Can't run template action, no path provided in action context.`,
        );
    }

    const templateRoot = join(context.path, source);
    const files = await readdir(templateRoot);

    for (const path of files) {
        const dest = join(destination, relative(templateRoot, path));
        const filePath = processPath(dest);
        await mkdirp(dirname(filePath));
        await writeFile(filePath, tpl(await readFile(path, "utf-8")));
    }
};
