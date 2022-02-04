export class NoUniqCliEntryPointError extends Error {
  constructor() {
    super(`More than 1 cli entry point found in the command (@Cli)`);
  }
}
