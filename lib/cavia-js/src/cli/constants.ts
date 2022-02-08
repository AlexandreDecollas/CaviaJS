export const CLI_BAD_OPTION_MESSAGE =
  'No or unknown option is given, do nothing... (-h for help)';
export const CLI_HELP_MESSAGE = `\n\n-==[  CaviaJS Command Line Tool  ]==-\n
The CLI commands you can use are : 
yarn cli -- -- [-hl] [-c command] [-p argument] 
      -h          : help
      -l          : list all the commands imported in the system
      -ce         : returns true if the command has a cli entry point method (a method with @CLI() decorator)
      -c command  : execute the command throw its entry point
      -p arg      : call the command with this sequence of arguments
`;
