// Main run info update functionality.
'use strict';

// The bundle name where all the run information is pulled from.
const speedcontrolBundle = 'nodecg-speedcontrol';
const donationBundle = 'speedcontrol-srcomtracker';

const rotateInterval = 15000;
let rotateState = 0;
let bidWarWrap = '';
let bidWarCurrent = 0;
let incentiveWrap = '';
let incentiveCurrent = 0;

// Initialize the page.
$(() => {
    // Run data.
    let runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
    let runDataArray = nodecg.Replicant('runDataArray', speedcontrolBundle);
    let bids = nodecg.Replicant('donationBidwars', donationBundle);
    let goals = nodecg.Replicant('donationGoals', donationBundle);

    // Get the next X runs in the schedule.
    function getNextRuns(runData, amount) {
        let nextRuns = [];
        let indexOfCurrentRun = findIndexInRunDataArray(runData);
        for (let i = 1; i <= amount; i++) {
            if (!runDataArray.value[indexOfCurrentRun + i]) {
                break;
            }
            nextRuns.push(runDataArray.value[indexOfCurrentRun + i]);
        }
        return nextRuns;
    }

    // Find array index of current run based on it's ID.
    function findIndexInRunDataArray(run) {
        let indexOfRun = -1;

        // Completely skips this if the run variable isn't defined.
        if (run) {
            for (let i = 0; i < runDataArray.value.length; i++) {
                if (run.id === runDataArray.value[i].id) {
                    indexOfRun = i; break;
                }
            }
        }

        return indexOfRun;
    }

    if (offlineMode) {
        loadOffline();
    }
    else {
        // Wait for replicants to load before we do anything.
        NodeCG.waitForReplicants(runDataActiveRun, runDataArray, bids, goals).then(loadFromSpeedControl);
    }

    // Rotate between upcoming runs, incentives, and bid wars.
    setInterval(rotate, rotateInterval);
    //rotate();
    function rotate() {
        if (rotateState === 0) {
            rotateState = 1;
            $('.bid-wars').hide();
            $('.schedule').fadeOut(500, () => {
                var bw_items_count = $('.incentive-wrapper').find('.incentive-item').length;
                if(bw_items_count > 3){
                    $('.incentive-wrapper').find('.incentive-item').hide();
                    if(incentiveCurrent == 0 || (incentiveCurrent) >= bw_items_count){
                        var bwItems = $('.incentive-wrapper').find('.incentive-item').slice(0, 3);
                        incentiveCurrent = 0;
                    }
                    else{
                        var bwItems = $('.incentive-wrapper').find('.incentive-item').eq(incentiveCurrent-1).nextAll().slice(0, 3); 
                    }
                    $.each(bwItems, function(bwi, bwv){
                        $(this).show();
                        incentiveCurrent++;
                    });
                }
                $('.incentives').fadeIn(500);
            });
        } else if (rotateState === 1) {
            rotateState = 2;
            $('.schedule').hide();
            $('.incentives').fadeOut(500, () => {
                var bw_items_count = $('.bid-wars-wrapper').find('.bid-war-item').length;
                if(bw_items_count > 3){
                    $('.bid-wars-wrapper').find('.bid-war-item').hide();
                    if(bidWarCurrent == 0 || (bidWarCurrent) >= bw_items_count){
                        var bwItems = $('.bid-wars-wrapper').find('.bid-war-item').slice(0, 3);
                        bidWarCurrent = 0;
                    }
                    else{
                        var bwItems = $('.bid-wars-wrapper').find('.bid-war-item').eq(bidWarCurrent-1).nextAll().slice(0, 3); 
                    }
                    $.each(bwItems, function(bwi, bwv){
                        $(this).show();
                        bidWarCurrent++;
                    });
                }
                $('.bid-wars').fadeIn(500);
            });
        } else {
            rotateState = 0;
            $('.incentives').hide();
            $('.bid-wars').fadeOut(500, () => {
                $('.schedule').fadeIn(500);
            });
        }
    }

    function loadOffline(){
        let comingUpGame = $('.coming-up-name');
        let comingUpRunner = $('.coming-up-runner');
        let comingUpCategory = $(".coming-up-category");

        comingUpGame.html("The World Ends With You");
        comingUpCategory.html("A category in this game");
        comingUpRunner.html("Protomagicalgirl & Witch's Hex");

        let onDeckGame1 = $(".on-deck-name1");
        let onDeckCategory1 = $(".on-deck-category1");
        let onDeckRunner1 = $(".on-deck-runner1");

        let onDeckGame2 = $(".on-deck-name2");
        let onDeckCategory2 = $(".on-deck-category2");
        let onDeckRunner2 = $(".on-deck-runner2");

        let onDeckGame3 = $(".on-deck-name3");
        let onDeckCategory3 = $(".on-deck-category3");
        let onDeckRunner3 = $(".on-deck-runner3");

        onDeckGame1.text("Quadrilateral Cowboy");
        onDeckCategory1.text("Any%");
        onDeckRunner1.text("The Runner");

        onDeckGame2.text("SMB2: Return 2 Subcon");
        onDeckCategory2.text("Very Easy All Dog Tags");
        onDeckRunner2.text("GRANDPOOBEAR");

        onDeckGame3.text("QUICKIE WORLD");
        onDeckCategory3.text("A nice category");
        onDeckRunner3.text("MEGMACATTACK");

        let incentiveGame1 = $(".incentive-game1");
        let incentiveName1 = $(".incentive-name1");
        let incentiveProgressText1 = $(".incentive-progress-text1");
        let incentiveProgressFull = $(".incentive-progress-full");
        let incentiveProgress1 = $(".incentive-progress1");

        let incentiveTotalValue1 = 750;
        let incentiveProgressValue1 = 600;
        let incentiveTextConcat1 = "$" + incentiveProgressValue1 + "/$" + incentiveTotalValue1;
        incentiveProgress1.width((incentiveProgressValue1 / incentiveTotalValue1) * incentiveProgressFull.width());
        incentiveProgress1.css('background-color', getProgressBarColor(incentiveProgressValue1, incentiveTotalValue1));

        incentiveGame1.text("SMB2: Return To Subcon");
        incentiveName1.text("TAS Showcase");
        incentiveProgressText1.text(incentiveTextConcat1);

        let incentiveGame2 = $(".incentive-game2");
        let incentiveName2 = $(".incentive-name2");
        let incentiveProgressText2 = $(".incentive-progress-text2");
        let incentiveProgress2 = $(".incentive-progress2");

        let incentiveTotalValue2 = 750;
        let incentiveProgressValue2 = 200;
        let incentiveTextConcat2 = "$" + incentiveProgressValue2 + "/$" + incentiveTotalValue2;
        incentiveProgress2.width((incentiveProgressValue2 / incentiveTotalValue2) * incentiveProgressFull.width());
        incentiveProgress2.css('background-color', getProgressBarColor(incentiveProgressValue2, incentiveTotalValue2));

        incentiveGame2.text("SMB2: Return To Subcon");
        incentiveName2.text("TAS Showcase");
        incentiveProgressText2.text(incentiveTextConcat2);

        let incentiveGame3 = $(".incentive-game3");
        let incentiveName3 = $(".incentive-name3");
        let incentiveProgressText3 = $(".incentive-progress-text3");
        let incentiveProgress3 = $(".incentive-progress3");

        let incentiveTotalValue3 = 750;
        let incentiveProgressValue3 = 400;
        let incentiveTextConcat3 = "$" + incentiveProgressValue3 + "/$" + incentiveTotalValue3;
        incentiveProgress3.width((incentiveProgressValue3 / incentiveTotalValue3) * incentiveProgressFull.width());
        incentiveProgress3.css('background-color', getProgressBarColor(incentiveProgressValue3, incentiveTotalValue3));

        incentiveGame3.text("SMB2: Return To Subcon");
        incentiveName3.text("TAS Showcase");
        incentiveProgressText3.text(incentiveTextConcat3);

        /* BID WAR */

        let bidWarGame = $(".bid-war-game");
        let bidWarName = $(".bid-war-name");

        let bidWarTotal = 300; /* All bids summed */

        let bidProgressFull = $(".bid-progress-full");

        let bidProgress1 = $(".bid-progress1");
        let bidName1 = $(".bid-name1");
        let bidProgressText1 = $(".bid-progress-text1");
        let bidProgressValue1 = 200;

        let bidProgress2 = $(".bid-progress2");
        let bidName2 = $(".bid-name2");
        let bidProgressText2 = $(".bid-progress-text2");
        let bidProgressValue2 = 50;

        let bidProgress3 = $(".bid-progress3");
        let bidName3 = $(".bid-name3");
        let bidProgressText3 = $(".bid-progress-text3");
        let bidProgressValue3 = 50;

        bidWarGame.text("DKC3");
        bidWarName.text("File Name Bidwar");

        bidProgress1.width((bidProgressValue1 / bidWarTotal) * bidProgressFull.width());
        bidProgress1.css('background-color', getProgressBarColor(bidProgressValue1, bidWarTotal));
        bidName1.text("20K Pan Mae");
        bidProgressText1.text('$' + bidProgressValue1);

        bidProgress2.width((bidProgressValue2 / bidWarTotal) * bidProgressFull.width());
        bidProgress2.css('background-color', getProgressBarColor(bidProgressValue2, bidWarTotal));
        bidName2.text("PUWP");
        bidProgressText2.text('$' + bidProgressValue2);

        bidProgress3.width((bidProgressValue3 / bidWarTotal) * bidProgressFull.width());
        bidProgress3.css('background-color', getProgressBarColor(bidProgressValue3, bidWarTotal));
        bidName3.text("PUWP");
        bidProgressText3.text('$' + bidProgressValue3);
    }

    // (As of writing) triggered from a dashboard button and also when a run's timer ends
    // nodecg.listenFor('forceRefreshIntermission', speedcontrolBundle, () => {
    //     refreshNextRunsData(runDataActiveRun.value);
    // });

    function loadFromSpeedControl() {
        // This is where the information is received for the run we want to display.
        // The "change" event is triggered when the current run is changed.
        runDataActiveRun.on('change', (newVal, oldVal) => {
            refreshNextRunsData(newVal);
        });

        runDataArray.on('change', (newVal, oldVal) => {
            refreshNextRunsData(runDataActiveRun.value);
        });

        bids.on('change', (newVal, oldVal) => {
            refreshNextBidsData(newVal);
        });
        goals.on('change', (newVal, oldVal) => {
            refreshNextGoalsData(newVal);
        });
    }

    function getNamesForRun(runData) {
        let currentTeamsData = getRunnersFromRunData(runData);
        let names = [];
        for (let team of currentTeamsData) {
            for (let player of team.players) {
                names.push(player.name);
            }
        }
        return names;
    }

    function refreshNextRunsData(currentRun) {
        const numUpcoming = 3;
        let nextRuns = getNextRuns(currentRun, numUpcoming);

        let comingUpGame = $('.coming-up-name');
        let comingUpCategory = $(".coming-up-category");
        let comingUpRunner = $('.coming-up-runner');

        // Next up game.
        comingUpGame.html(currentRun.game);
        comingUpCategory.html(currentRun.category);
        comingUpRunner.html(getNamesForRun(runDataActiveRun.value).join(', '));

        // On deck games.
        let i = 0;
        for (let run of nextRuns) {
            i += 1;
            let onDeckGame = $(".on-deck-name" + i);
            let onDeckCategory = $(".on-deck-category" + i);
            let onDeckRunner = $(".on-deck-runner" + i);
            onDeckGame.html(run.game).show();
            onDeckCategory.html(run.category).show();
            onDeckRunner.html(getNamesForRun(run).join(', ')).show();
        }

        // Hide extra on deck games we don't need.
        for (let j = i + 1; j <= numUpcoming; j++) {
            $(".on-deck-name" + j).hide();
            $(".on-deck-runner" + j).hide();
        }
    }

    function refreshNextGoalsData(incentives) {
        const numIncentives = 3;
        const numBids = 1;

        incentives = $.parseJSON(JSON.stringify(incentives));

        if(incentiveWrap == ''){
            incentiveWrap = $('.incentive-wrapper').clone();
        }

        $('.incentive-wrapper').html('');
        let i = 0;
        for (let bid of incentives) {
            i += 1;

            let incentiveGame = incentiveWrap.find(".incentive-game1");
            let incentiveName = incentiveWrap.find(".incentive-name1");
            let incentiveProgressText = incentiveWrap.find(".incentive-progress-text1");
            let incentiveProgressFull = incentiveWrap.find(".incentive-progress-full");
            let incentiveProgress = incentiveWrap.find(".incentive-progress1");

            let incentiveTotalValue = bid.minimum/100;
            let incentiveProgressValue = bid.current/100;
            let incentiveTextConcat = currencyFormatter.format(incentiveProgressValue) + "/" + currencyFormatter.format(incentiveTotalValue);
            incentiveProgress.width(((incentiveProgressValue / incentiveTotalValue) * 100) + '%');
            incentiveProgress.css('background-color', getProgressBarColor(incentiveProgressValue, incentiveTotalValue));

            incentiveGame.text('');
            incentiveName.text(bid.title);
            incentiveProgressText.text(incentiveTextConcat);

            $('.incentive-wrapper').append('<div class="incentive-item incentive-item-'+i+'" style="margin-bottom:10px">'+incentiveWrap.html()+'</div>');
        }


    }


    function refreshNextBidsData(bidWars) {
        const numIncentives = 3;
        const numBids = 1;
        bidWars = bidWars = $.parseJSON(JSON.stringify(bidWars));

        if(bidWarWrap == ''){
            bidWarWrap = $(".bid-wars-wrapper").clone();
        }

        $(".bid-wars-wrapper").html('');
        //let bidWarsWrapper = $(".bid-wars-wrapper");
        //bidWarsWrapper.hide();

        if (bidWars.length > 0) {
            //console.log($.parseJSON(JSON.stringify(bidWars)));
            $.each(bidWars, function(i,bv){

            let bid = bv;
            if(bid.status != "open") return;

            let bidWarGame = bidWarWrap.find(".bid-war-game");
            let bidWarName = bidWarWrap.find(".bid-war-name");
            bidWarGame.text('');
            bidWarName.text(bid.title);

            let bidWarTotal = 0; /* All bids summed */
            $.each(bid.goals.data, function(ii,vv){
                bidWarTotal = bidWarTotal+vv.current;
            });
            bidWarTotal = bidWarTotal/100;

            let bidProgressFull = bidWarWrap.find(".bid-progress-full");

            // Show max 3 options.
            bidWarWrap.find(".bid").hide();
            for (let i = 1; i <= 3; i++) {
                if (bid.goals.data.length >= i) {
                    let option = bid.goals.data[i - 1];
                    let bidProgress = bidWarWrap.find(".bid-progress" + i);
                    let bidName = bidWarWrap.find(".bid-name" + i);
                    let bidProgressText = bidWarWrap.find(".bid-progress-text" + i);
                    let bidProgressValue = option.current/100;
                    let progress;
                    
                    if (bidWarTotal) {
                        progress = bidProgressValue / bidWarTotal;
                    } else {
                        progress = 0;
                    }

                    bidProgress.width((progress * 100)+'%');
                    bidProgress.css('background-color', getProgressBarColor(bidProgressValue, bidWarTotal));
                    bidName.text(option.title);
                    bidProgressText.text(currencyFormatter.format(bidProgressValue));

                    // Show the container for this bid.
                    bidName.closest(".bid").show();
                }
            }

            $(".bid-wars-wrapper").append('<div class="bid-war-item" style="margin-bottom:10px;">'+bidWarWrap.html()+'</div>');
            });
            // Show bid war.
            //bidWarsWrapper.show();
        }
    }
});
