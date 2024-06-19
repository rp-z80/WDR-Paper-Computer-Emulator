const instructionSet = new Set(["inc", "dec", "jmp", "isz","stp"]);
let pc = 1;
let oldline = 1;
var lineno = 1;

window.onload = ()=> {
    document.getElementById("code").value = "";
    for(let i=1; i<=8; i++) {
        document.getElementById("reg"+i.toString()).value=0;
    }
};

function nextInstruction(s=[true]) {
    const parseInstruction = document.getElementById(lineno).value.trim();
    const instruction = parseInstruction.split(" ");
    analiseSyntax(instruction);
    colorLine();
    CPU(instruction,s);
    document.getElementById("code").scrollTop = document.getElementById("code").scrollHeight;
}

async function autoExec() {
    document.getElementById("step").disabled = true;
    document.getElementById("reset").disabled = true;
    document.getElementById("run").disabled = true;
    let stop = [false];
    while(!stop[0]) {
        nextInstruction(stop);
        await sleep(1000);
    }
    document.getElementById("step").disabled = false;
    document.getElementById("reset").disabled = false;
    document.getElementById("run").disabled = false;
}

function reset() {
    document.getElementById("code").value = "";
    for(let i=1; i<=8; i++) {
        document.getElementById("reg"+i.toString()).value=0;
    }
    document.getElementById("lineno"+lineno.toString()).style="background-color:white;";
    lineno=1;
    oldline=1;
    pc=1;
}

function CPU(instruction, s=[true]) {
    const operator = instruction[0];
    const operand = instruction[1];
    document.getElementById("code").value+=pc + ":\t"+ operator + " " + operand + "\n";

    let va=0;

    switch(operator) {
        //inc *register*: Add 1 to the register.
        case "inc":
            va = Number(document.getElementById("reg"+operand.toString()).value)+1;
            document.getElementById("reg"+operand.toString()).value=va.toString();
            lineno++;
            break;

        //dec *register*: Subtract 1 from the register.
        case "dec":
            va = Number(document.getElementById("reg"+operand.toString()).value)-1;
            document.getElementById("reg"+operand.toString()).value=va.toString();
            lineno++;
            break;
        
        //jmp *line*: Jumps to the specified line.
        case "jmp":
            lineno = Number(operand);
            break;

        //isz *register*: Checks if the register is zero. If so, skips a line. If not, continues normally.
        case "isz":
            if(document.getElementById("reg"+operand.toString()).value==0) {
                lineno++;
            }
            lineno++;
            break;
        
        //stp: Stops the program.
        case "stp":
            s[0]=true;
            break;

        default:
            break;
    }
    pc++;
}

function analiseSyntax(instruction) {
    if(!instructionSet.has(instruction[0])) {
        window.alert(instruction[0] + " is not recognised as a valid instruction");
    } else if(instruction[0] != "jmp" || instruction != "stp") {
        if(instruction[1]>8 || instruction[1]<1) {
            window.alert(instruction[1] + " is not recognised as a valid register");
        }
    } else if(instruction[0] == "jmp") {
        if(instruction[1] > 21 || instruction[1]<1) {
            window.alert("cannot jump to line number " + instruction[1]);
        }
    }
}

function colorLine() {
    document.getElementById("lineno"+oldline.toString()).style="background-color:white;";
    document.getElementById("lineno"+lineno.toString()).style="background-color:green;";
    oldline=lineno;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}