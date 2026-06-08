var incomeRows = "";
var expenseRows = "";

function loadPersonality(){
    var income = parseFloat(localStorage.getItem("totalIncome"));
    var expense = parseFloat(localStorage.getItem("totalExpense"));
    var rows = localStorage.getItem("expenseRows");

    if(isNaN(income)) income = 0;
    if(isNaN(expense)) expense = 0;
    if(rows == null) rows = "";

    calculatePersonality(income, expense, rows);
}

function calculatePersonality(income, expense, rows){
    var savingsRate = 0;
    if(income > 0){
        savingsRate = ((income - expense) / income) * 100;
    }
    if(savingsRate < 0){ savingsRate = 0; }
    calculateScores(savingsRate, rows);
}

function calculateScores(savingsRate, rows){
    var planningScore;
    var savingTendency;
    var riskTolerance = 5;
    var food = 0;
    var transport = 0;
    var education = 0;
    var entertainment = 0;
    var shopping = 0;

    if(savingsRate >= 40){ planningScore = 8.5; }
    else if(savingsRate >= 25){ planningScore = 7.5; }
    else if(savingsRate >= 10){ planningScore = 6.5; }
    else if(savingsRate >= 0){ planningScore = 5.5; }
    else{ planningScore = 3.5; }

    savingTendency = savingsRate / 10;
    if(savingTendency > 10){ savingTendency = 10; }

    var word = "";
    for(var i = 0; i < rows.length; i++){
        var ch = rows[i];
        if(ch != "<" && ch != ">" && ch != "/" && ch != " "){
            word += ch;
        } else {
            if(word == "Food&Dining" || word == "Food"){ food++; }
            else if(word == "Transportation"){ transport++; }
            else if(word == "Education"){ education++; }
            else if(word == "Entertainment"){ entertainment++; }
            else if(word == "Shopping"){ shopping++; }
            word = "";
        }
    }

    if(entertainment >= 2){ riskTolerance++; }
    if(shopping >= 2){ riskTolerance++; }
    if(education >= 2){ riskTolerance--; }
    if(savingsRate > 40){ riskTolerance--; }
    if(riskTolerance < 3){ riskTolerance = 3; }
    if(riskTolerance > 9){ riskTolerance = 9; }

    displaySummary(planningScore, savingTendency, riskTolerance,
        savingsRate, entertainment, shopping, education);
}

function displaySummary(planning, saving, risk, savingsRate, entertainment, shopping, education){
    document.getElementById("planningScore").innerHTML = planning.toFixed(1) + "/10";
    document.getElementById("savingTendency").innerHTML = saving.toFixed(1) + "/10";
    document.getElementById("riskTolerance").innerHTML = risk.toFixed(1) + "/10";

    var personality;
    var description;

    if(planning >= 8 && saving >= 6){
        personality = "The Mindful Spender";
        description = "You demonstrate thoughtful financial decision-making with a balanced approach to saving and spending. You prioritize essential expenses while maintaining room for occasional treats.";
    }
    else if(saving >= 8 && risk <= 4){
        personality = "The Cautious Saver";
        description = "You value security and consistently prioritize saving. You carefully consider financial decisions before taking action.";
    }
    else if(planning >= 7){
        personality = "The Goal-Oriented Planner";
        description = "You make intentional choices and focus on achieving long-term financial goals through discipline and planning.";
    }
    else if(risk >= 7){
        personality = "The Free Spirit";
        description = "You enjoy flexibility and experiences, although developing stronger financial habits could improve stability.";
    }
    else{
        personality = "The Balanced Budgeter";
        description = "You maintain a practical approach to money and strive for financial stability through balanced decision-making.";
    }

    document.getElementById("personalityType").innerHTML = personality;
    document.getElementById("personalityDescription").innerHTML = description;

    calculateTraits(planning, savingsRate, entertainment, shopping, education);
}

function calculateTraits(planning, savingsRate, entertainment, shopping, education){
    var budget = Math.round(Math.min(100, savingsRate + 30));
    var impulse = Math.max(0, 100 - (shopping * 15));
    var focus = Math.min(100, Math.round((education * 10) + savingsRate));
    var confidence = Math.round(planning * 8);
    var social = Math.min(100, entertainment * 15);
    var tech = 70 + ((shopping + entertainment) % 21);

    setTrait("budget", budget);
    setTrait("impulse", impulse);
    setTrait("focus", focus);
    setTrait("confidence", confidence);
    setTrait("social", social);
    setTrait("tech", tech);
}

function setTrait(name, value){
    document.getElementById(name + "Trait").innerHTML = value + "%";
    document.getElementById(name + "Bar").style.width = value + "%";
}
