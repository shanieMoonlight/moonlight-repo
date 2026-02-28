import { spawnSync } from 'child_process';
import { CommandResult } from "./command-models";
import chalk from 'chalk';

/**
 * Utility class for running shell commands and build-related operations.
 */
export class CommandUtils {
    /**
     * Runs a shell command synchronously and returns the result.
     * @param command The command to run.
     * @param options Additional options for spawnSync.
     * @returns CommandResult containing stdout, stderr, and status code.
     */
    static run(command: string, options = {}): CommandResult {
        const result = spawnSync(command, { shell: true, stdio: 'pipe', encoding: 'utf-8', ...options });
        return {
            stdout: result.stdout,
            stderr: result.stderr,
            status: result.status ?? 1
        };
    }

    //----------------------------//

    static npmPack = (verbose: boolean = true): CommandResult =>
        CommandUtils.run(`npm pack ${verbose ? '--verbose' : ''}`)

    //----------------------------//

    static npmPublishPublic(
        packageDistToken: string,
        token: string,
        dryRun: boolean = true,
        verbose: boolean = true,
    ): CommandResult {


        const tokenLength = token.length;
        console.log(chalk.blueBright(`Token Check: ${token.substring(0, 3)}***${token.substring(tokenLength - 3, tokenLength)}`));

        let command = `npm publish --access public --//registry.npmjs.org/:_authToken=${token}`;

        console.log(chalk.blueBright(`Publish Command: ${command.substring(0, command.length - 25)}...`));
        if (dryRun)
            command += ' --dry-run'
        if (verbose)
            command += ' --verbose'
        return CommandUtils.run(command, { cwd: packageDistToken })

    }

}//Cls