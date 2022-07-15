// Main run info update functionality.
'use strict';

let resizeElementList = [];
const layoutBundle = 'speedcontrol-layoutswitch';

$(() => {
    if (offlineMode) {
        loadOffline();
    }
    else{
        loadFromSpeedControl();
    }

    let currentLayout = nodecg.Replicant('currentGameLayout', layoutBundle);
    currentLayout.on('change', newVal => {
        if (newVal) {
            for (let element in resizeElementList) {
                resizeObserver.unobserve(resizeElementList[element]);
            }
            resizeElementList = [];
            loadFromSpeedControl();
        }
    });

    function loadOffline(){
        let gameTitle = $('#title');
        let gameCategory = $('#category-text');
        let gameSystem = $('#platform-text');
        let gameYear = $('#year-text');
        let gameEstimate = $('#estimate-text');

        let name1 = $("#runner-name1");
        let pronouns1 = $("#pronouns1");

        let name2 = $("#runner-name2");
        let pronouns2 = $("#pronouns2");

        let name3 = $("#runner-name3");
        let pronouns3 = $("#pronouns3");

        let name4 = $("#runner-name4");
        let pronouns4 = $("#pronouns4");

        gameTitle.html("Title");
        gameCategory.html("category");
        gameSystem.html("system");
        gameYear.html("1902");
        gameEstimate.html("5:15:30");

        name1.text("Conklestothemax");
        pronouns1.text("He/Him");

        name2.text("Protomagicalgirl");
        pronouns2.text("It/She");

        name3.text("arael");
        pronouns3.text("They/She");

        name4.text("iBazly");
        pronouns4.text("He/They");
    }

    const resizeObserver = new ResizeObserver(entries => {
        setTimeout(() => {
            for (let entry of entries) {
                const element = entry.target;
                element.style.fontSize = "";
                let fontSize = getComputedStyle(element).fontSize;
                fontSize = fontSize.substring(0, fontSize.length - 2);

                let parentOuterWidth = element.parentElement.offsetWidth;
                while (element.offsetWidth > parentOuterWidth) {

                    element.style.fontSize = `${--fontSize}px`;
                }
            }
        }, 50);
    });

    function loadFromSpeedControl() {
        // The bundle name where all the run information is pulled from.
        const speedcontrolBundle = 'nodecg-speedcontrol';
        const layoutBundle = 'speedcontrol-layoutswitch';

        // Selectors.
        let gameTitle = document.getElementById('title');
        let gameCategory = document.getElementById('category-text');
        let gameSystem = document.getElementById('platform-text');
        let gameYear = document.getElementById('year-text');
        let gameEstimate = document.getElementById('estimate-text');
        let gameCommentators = document.getElementById('commentators-text');

        resizeElementList = [gameTitle, gameCategory, gameSystem, gameYear, gameEstimate, gameCommentators];

        // This is where the information is received for the run we want to display.
        // The "change" event is triggered when the current run is changed.
        let runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
        runDataActiveRun.on('change', (newVal, oldVal) => {
            if (newVal)
                updateSceneFields(newVal);
        });

        // Sets information on the pages for the run.
        function updateSceneFields(runData) {

            let currentTeamsData = getRunnersFromRunData(runData);

            // Split year out from system platform, if present.
            gameTitle.textContent = runData.game;
            gameCategory.textContent = runData.category;
            gameSystem.textContent = runData.system;
            gameYear.textContent = runData.release;
            gameEstimate.textContent = runData.estimate;
            gameCommentators.textContent = runData.customData.commentators;

            // Set each player names and pronouns.
            let i = 0;
            for (let team of currentTeamsData) {
                for (let player of team.players) {
                    i += 1;
                    let name = document.getElementById("runner-name" + i);
                    let pronouns = document.getElementById("pronouns" + i);

                    if (name === null) {
                        break;
                    }
                    name.textContent = player.name;
                    pronouns.textContent = player.pronouns;

                    resizeElementList.push(name);
                    resizeElementList.push(pronouns);
                }
            }

            for (let element in resizeElementList) {
                resizeObserver.observe(resizeElementList[element]);
            }
        }
    }
});
