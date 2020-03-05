import {
    ActionRunContext,
    fileTemplate,
    pathTemplate,
    PathUtil,
} from "buurman-utils";
import { mkdirp, readFile, writeFile } from "fs-extra";
import { join, relative, dirname } from "path";
import readdir from "recursive-readdir";

export interface Inputs {
    source: string;
    destination: string;
    variables?: object;
}

const run = async (
    context: ActionRunContext,
    { source, variables, destination }: Inputs,
) => {
    const { resolveFeaturePath, relativeFeaturePath } = PathUtil(context);

    const processPath = pathTemplate(variables);
    const tpl = fileTemplate(variables);

    const files = await readdir(resolveFeaturePath(source));

    for (const path of files) {
        const dest = join(
            process.cwd(),
            destination,
            relative(source, relativeFeaturePath(path)),
        );
        const filePath = processPath(dest);
        await mkdirp(dirname(filePath));
        await writeFile(filePath, tpl(await readFile(path, "utf-8")));
    }
};

export default run;
