import { renderRecipeDetails } from "./app.js";

const Router = {
    init: () => {       
        // It listen for history changes
        window.addEventListener('popstate',  event => {
            Router.go(event.state.route, false);
        });
        // Process initial URL   
        Router.go(location.pathname);
    },    
    go: (route, addToHistory=true) => {
        if (addToHistory) {
            history.pushState({ route }, '', route);
        }
        document.querySelectorAll("section.page")
            .forEach(s => s.style.display = "none");
        switch (route) {
            case "/":
                document.querySelector("section#home").style.display = "block";
                break;
            default:
                if (route.startsWith("/recipe")) {                
                    document.querySelector("section#recipe").style.display = "block";
                    const id = route.substring(route.lastIndexOf("/")+1);
                    renderRecipeDetails(id);
                }
                break;   
        }
        window.scrollX = 0;
    }
}

export default Router;