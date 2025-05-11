import chalk from 'chalk'; // Assuming chalk@4



export function logErrorToConsole(err: any, asWarning = false) {
    const logFn = asWarning ? console.warn : console.error;

    if (!asWarning)
        logFn(chalk.red.bold("😱 ERROR: An error occurred during the publish processing! 👻"));

    if (err instanceof Error) {
        logFn(chalk.red(err.message));
        if (err.stack) {
            logFn(chalk.gray(err.stack));
        }
    } else {
        logFn(chalk.red(String(err)));
    }
}
