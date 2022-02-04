export const CLI_BAD_OPTION_MESSAGE =
  'No or unknown option is given, do nothing...';
export const CLI_HELP_MESSAGE = `\n\n-==[  CaviaJS Command Line Tool  ]==-\n
The CLI commands you can use are : 
      -h  : help
      -l  : list all the commands imported in the system
      -ce : returns true if the command has a cli entry point method (a method with @CLI() decorator)
      -c  : execute the command throw its entry point\n`;
