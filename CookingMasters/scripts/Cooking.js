import { alertTimerFinished } from "./app.js";

// WebKit prefix still mandatory for iPad and Safari on macOS
export const Cooking = {
    init: (element) => {
        Cooking.root = element;
        Cooking.timers = [];
        // ADDED
        const handler = e => {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                Cooking.root.hidden = true;
            }            
        }
        document.addEventListener("fullscreenchange", handler);
        document.addEventListener("webkitfullscreenchange", handler);

        Cooking
    },
    start: (recipe) => {
        Cooking.root.hidden = false;
        Cooking.recipe = recipe;

        document.querySelector("#cooking h2").textContent = `${recipe.name}: Steps`;
        Cooking.step(0);

        // ADDED
        if (Cooking.root.requestFullscreen) {
            Cooking.root.requestFullscreen();
        } else {
            if (Cooking.root.webkitRequestFullscreen) {
                Cooking.root.webkitRequestFullscreen();
            } 
        }
    },    
    end: () => {
        document.exitFullscreen();   
    },
    next: () => {
        Cooking.step(Cooking.currentStep + 1);
    },
    previous: () => {
        Cooking.step(Cooking.currentStep - 1);
    },
    addTimer: (name, minutes) => {
        // Change 1 with minutes for real world
        const li = document.createElement("li");
        li.innerHTML = `
            <article class="timer">
                <h5>${name}</h5>
                <p>${String(minutes).padStart(2, '0')}:00</p>
            </article>
        `;

        document.querySelector("#cooking ul").appendChild(li);
        const timer = {
            name,
            duration: minutes*60,
            current: minutes*60,
            element: li,
        }
        const timerFunction = ()=> {
            Cooking.updateTimer(timer)
        };
      
        timer.interval = setInterval(timerFunction.bind(timer), 1000);
        li.onclick = () => {
            li.remove();
            clearInterval(timer.interval);
        }  
        Cooking.timers.push(timer);
    },
    updateTimer: (timer) => {
        timer.current--;
        timer.element.querySelector("p").textContent = `${String(Math.floor(timer.current / 60)).padStart(2, '0')}:${String(timer.current % 60).padStart(2, '0')}`
        if (timer.current<20) {
            timer.element.style.color = "red";
        }
        if (timer.current==0) {
            alertTimerFinished(timer);
            timer.element.querySelector("article").style.color = "white";
            timer.element.querySelector("article").style.backgroundColor = "red";
            clearInterval(timer.interval);
        }
    },
    step: (index) => {
        Cooking.currentStep = index;
        if (index>Cooking.recipe.steps.length-1) {
            Cooking.end();
        }
        const step = Cooking.recipe.steps[index];
        document.querySelector("#cooking h3").textContent = `${index+1} of ${Cooking.recipe.steps.length} | ${step.name}`;
        document.querySelector("#cooking .step").innerHTML = step.description ;

        if (step.timer) {
            const timerButton = document.createElement("button");
            timerButton.textContent = `Add timer for ${step.timer} minutes`;
            timerButton.onclick = () => {
                Cooking.addTimer(step.name, step.timer);
            }
            document.querySelector("#cooking .step").appendChild(timerButton);

        }

        document.querySelector("#btn-previous").disabled = index==0;
        document.querySelector("#btn-next").textContent = index==Cooking.recipe.steps.length-1 ? "You finished!" : "Next Step";

    }
}