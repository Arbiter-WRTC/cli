import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";

export const warning = chalk.yellow;
export const red = chalk.red;
export const highlight = chalk.bold.hex("#39C5FB");
export const cyan = chalk.cyan;
export const green = chalk.green;
export const secondary = chalk.gray;
export const arbiterGradient = gradient(["#F03D98","#0D2D7D", "#0D2D7D", "#F03D98"]);

export let logo: string | undefined;

export const display = (text: string) => {
  console.log(text);
};

export const gradientText = (text: string) => {
  console.log(arbiterGradient(text));
}

export const warn = (text: string) => {
  console.log(warning(text));
};

export const error = (text: string) => {
  console.log(red(text));
};

export const success = (text: string) => {
  console.log(green(text));
};

export const clear = () => {
  console.clear();
};

export const greet = (): void => {
  clear();
  console.log(arbiterGradient("\n  Welcome to Arbiter!"));
};

export const printLogo = (): void => {
  console.log(gradient(["#F03D98","#0D2D7D", "#0D2D7D", "#F03D98"])(`
             :**********+.          -+++++++++:
            +#########-+##-          :+++++++++=                           
          :*########*.  -##*.         .=+++++++++:                         
         =#########=     .*##-          -+++++++++-                        
       .*########*.        -##+          .++++++++++.                      
      -*########=          :*##*:          -+++++++++-                     
     .++*#######-          =######=          :++++++++++.                   
    -+++*######-         :*########*:         :*+++++++++-                  
   =++++*#####*         =############=         +#*++++++++=.                
 :+++++++*####-        :##############-        -##*+++++++++:               
:+++++++++*###-        =##############=        :###*+++++++++:              
 .+++++++++*##=        .##############:        -#####+++++++.               
   -+++++++++**         :############:         *#####*++++-                 
    .+++++++++*=          +########+.         =#######+++:                  
      =+++++++++-          -######-          =#######*+=                    
       :+++++++++=.         .+###.         .+########*:                     
         =+++++++++:          -##+.       -#########+                       
          :+++++++++=          .*##-     +#########-                        
            =+++++++++:          =##+  :#########*.                         
             :+++++++++=          .*##+#########-                           
              .----------           -==========.\n`));
};

const centerText = (text: string | undefined, width: number): string | undefined => {
  let lines = text?.split("\n");
  let centeredText = lines?.map((line) => {
    let leftPadding = Math.floor((width - line.length) / 2);
    return ' '.repeat(leftPadding > 0 ? leftPadding : 0) + line;
  }).join("\n");
  return centeredText || undefined;
}

export const generateName = (): Promise<void> => {
  return Promise.resolve(
    figlet.text(
      "ARBITER",
      {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
      },
      (err, data) => {
        if (err) {
          console.log("Something went wrong...");
          console.dir(err);
          return;
        }
        const centeredData = centerText(data, 60)
        console.log(gradient(["#F03D98","#0D2D7D", "#0D2D7D", "#F03D98"])(`${centeredData}\n`));
      }
    ));
};

export const deploySuccessText = (): void => {
  console.log(arbiterGradient("Arbiter successfully deployed!"));
};