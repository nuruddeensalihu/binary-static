var Content = (function () {
    'use strict';

    var localize = {};

    var populate = function () {
        localize = {
            textStartTime: text.localize('Start time'),
            textSpot: text.localize('Spot'),
            textBarrier: text.localize('Barrier'),
            textBarrierOffset: text.localize('Barrier offset'),
            textHighBarrier: text.localize('High barrier'),
            textHighBarrierOffset: text.localize('High barrier offset'),
            textLowBarrier: text.localize('Low barrier'),
            textLowBarrierOffset: text.localize('Low barrier offset'),
            textPayout: text.localize('Payout'),
            textStake: text.localize('Stake'),
            textPurchase: text.localize('Purchase'),
            textDuration: text.localize('Duration'),
            textEndTime: text.localize('End Time'),
            textMinDuration: text.localize('min'),
            textMinDurationTooltip: text.localize('minimum available duration'),
            textBarrierOffsetTooltip: text.localize("Enter the barrier in terms of the difference from the spot price. If you enter +0.005, then you will be purchasing a contract with a barrier 0.005 higher than the entry spot. The entry spot will be the next tick after your order has been received"),
            textDurationSeconds: text.localize('seconds'),
            textDurationMinutes: text.localize('minutes'),
            textDurationHours: text.localize('hours'),
            textDurationDays: text.localize('days'),
            textDurationTicks: text.localize('ticks'),
            textNetProfit: text.localize('Net profit'),
            textReturn: text.localize('Return'),
            textNow: text.localize('Now'),
            textContractConfirmationHeading: text.localize('Contract Confirmation'),
            textContractConfirmationReference: text.localize('Your transaction reference is'),
            textContractConfirmationBalance: text.localize('Account balance:'),
            textFormRiseFall: text.localize('Rise/Fall'),
            textFormHigherLower: text.localize('Higher/Lower'),
            textFormUpDown: text.localize('Up/Down'),
            textFormInOut: text.localize('In/Out'),
            textContractPeriod: text.localize('Contract period'),
            textExercisePeriod: text.localize('Exercise price'),
            predictionLabel: text.localize('Last Digit Prediction'),
            textContractConfirmationPayout: text.localize('Potential Payout'),
            textContractConfirmationCost: text.localize('Total Cost'),
            textContractConfirmationProfit: text.localize('Potential Profit'),
            textAmountPerPoint: text.localize('Amount per point'),
            textStopLoss: text.localize('Stop-loss'),
            textStopProfit: text.localize('Stop-profit'),
            textStopType: text.localize('Stop-type'),
            textStopTypePoints: text.localize('Points'),
            textContractConfirmationButton: text.localize('View'),
            textIndicativeBarrierTooltip: text.localize('This is an indicative barrier. Actual barrier will be the entry spot plus the barrier offset.'),
            textSpreadTypeLong: text.localize('Long'),
            textSpreadTypeShort: text.localize('Short'),
            textSpreadDepositComment: text.localize('Deposit of'),
            textSpreadRequiredComment: text.localize('is required. Current spread'),
            textSpreadPointsComment: text.localize('points'),
            textContractStatusWon: text.localize('This contract won'),
            textContractStatusLost: text.localize('This contract lost'),
            textTickResultLabel: text.localize('Tick'),
            textStatement: text.localize('Statement'),
            textDate: text.localize('Date'),
            textRef: text.localize('Ref.'),
            textAction: text.localize('Action'),
            textDescription: text.localize('Description'),
            textCreditDebit: text.localize('Credit/Debit'),
            textBalance: text.localize('Balance'),
            textProfitTable: text.localize('Profit Table'),
            textPurchaseDate: text.localize('Purchase Date'),
            textContract: text.localize('Contract'),
            textPurchasePrice: text.localize('Purchase Price'),
            textSaleDate: text.localize('Sale Date'),
            textSalePrice: text.localize('Sale Price'),
            textProfitLoss: text.localize('Profit/Loss'),
            textTotalProfitLoss: text.localize('Total Profit/Loss'),
            textLimits: text.localize('Trading and Withdrawal Limits'),
            textItem: text.localize('Item'),
            textLimit: text.localize('Limit'),
            textMaxOpenPosition: text.localize('Maximum number of open positions'),
            textMaxOpenPositionTooltip: text.localize('Represents the maximum number of outstanding contracts in your portfolio. Each line in your portfolio counts for one open position. Once the maximum is reached, you will not be able to open new positions without closing an existing position first.'),
            textMaxAccBalance: text.localize('Maximum account cash balance'),
            textMaxAccBalanceTooltip: text.localize('Represents the maximum amount of cash that you may hold in your account.  If the maximum is reached, you will be asked to withdraw funds.'),
            textMaxDailyTurnover: text.localize('Maximum daily turnover'),
            textMaxDailyTurnoverTooltip: text.localize('Represents the maximum volume of contracts that you may purchase in any given trading day.'),
            textMaxAggregate: text.localize('Maximum aggregate payouts on open positions'),
            textMaxAggregateTooltip: text.localize('Presents the maximum aggregate payouts on outstanding contracts in your portfolio. If the maximum is attained, you may not purchase additional contracts without first closing out existing positions.'),
            textTradingLimits: text.localize('Trading Limits'),
            textWithdrawalTitle: text.localize('Withdrawal Limits'),
            textWithdrawalLimits: text.localize('Your withdrawal limit is EUR'),
            textCurrencyEquivalent: text.localize('or equivalent in other currency'),
            textWithrawalAmount: text.localize('You have already withdrawn the equivalent of EUR'),
            textYour: text.localize('Your'),
            textDayWithdrawalLimit: text.localize('day withdrawal limit is currently EUR'),
            textAuthenticatedWithdrawal: text.localize('Your account is fully authenticated and your withdrawal limits have been lifted.'),
            textAggregateOverLast: text.localize('in aggregate over the last'),
            textWithdrawalForEntireDuration: text.localize('Your withdrawal limit for the entire duration of the account is currently: EUR'),
            textInAggregateOverLifetime: text.localize('in aggregate over the lifetime of your account.'),
            textNotAllowedToWithdraw: text.localize('Therefore you may not withdraw any additional funds.'),
            textCurrentMaxWithdrawal: text.localize('Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is EUR'),
            textBuyPrice: text.localize('Buy price'),
            textFinalPrice: text.localize('Final price'),
            textLoss: text.localize('Loss'),
            textProfit: text.localize('Profit'),
            textFormMatchesDiffers: text.localize('Matches/Differs'),
            textFormEvenOdd: text.localize('Even/Odd'),
            textFormOverUnder: text.localize('Over/Under'),
            textMessageRequired: text.localize('This field is required.'),
            textMessageCountLimit: text.localize('You should enter between %LIMIT% characters.'), // %LIMIT% should be replaced by a range. sample: (6-20)
            textMessageJustAllowed: text.localize('Only %ALLOWED% are allowed.'), // %ALLOWED% should be replaced by values including: letters, numbers, space, period, ...
            textLetters: text.localize('letters'),
            textNumbers: text.localize('numbers'),
            textSpace: text.localize('space'),
            textPeriod: text.localize('period'),
            textComma: text.localize('comma')
        };

        var starTime = document.getElementById('start_time_label');
        if (starTime) {
            starTime.textContent = localize.textStartTime;
        }

        var minDurationTooltip = document.getElementById('duration_tooltip');
        if (minDurationTooltip) {
            minDurationTooltip.textContent = localize.textMinDuration;
            minDurationTooltip.setAttribute('title', localize.textMinDurationTooltip);
        }

        var spotLabel = document.getElementById('spot_label');
        if (spotLabel) {
            spotLabel.textContent = localize.textSpot;
        }

        var barrierTooltip = document.getElementById('barrier_tooltip');
        if (barrierTooltip) {
            barrierTooltip.textContent = localize.textBarrierOffset;
            barrierTooltip.setAttribute('title', localize.textBarrierOffsetTooltip);
        }

        var barrierSpan = document.getElementById('barrier_span');
        if (barrierSpan) {
            barrierSpan.textContent = localize.textBarrier;
        }

        var barrierHighTooltip = document.getElementById('barrier_high_tooltip');
        if (barrierHighTooltip) {
            barrierHighTooltip.textContent = localize.textHighBarrierOffset;
            barrierHighTooltip.setAttribute('title', localize.textBarrierOffsetTooltip);
        }
        var barrierHighSpan = document.getElementById('barrier_high_span');
        if (barrierHighSpan) {
            barrierHighSpan.textContent = localize.textHighBarrier;
        }

        var barrierLowTooltip = document.getElementById('barrier_low_tooltip');
        if (barrierLowTooltip) {
            barrierLowTooltip.textContent = localize.textLowBarrierOffset;
            barrierLowTooltip.setAttribute('title', localize.textBarrierOffsetTooltip);
        }
        var barrierLowSpan = document.getElementById('barrier_low_span');
        if (barrierLowSpan) {
            barrierLowSpan.textContent = localize.textLowBarrier;
        }

        var predictionLabel = document.getElementById('prediction_label');
        if(predictionLabel){
            predictionLabel.textContent = localize.predictionLabel;
        }

        var payoutOption = document.getElementById('payout_option');
        if (payoutOption) {
            payoutOption.textContent = localize.textPayout;
        }

        var stakeOption = document.getElementById('stake_option');
        if (stakeOption) {
            stakeOption.textContent = localize.textStake;
        }

        var purchaseButtonTop = document.getElementById('purchase_button_top');
        if (purchaseButtonTop) {
            purchaseButtonTop.textContent = localize.textPurchase;
        }

        var purchaseButtonBottom = document.getElementById('purchase_button_bottom');
        if (purchaseButtonBottom) {
            purchaseButtonBottom.textContent = localize.textPurchase;
        }

        var period_label = document.getElementById('period_label');
        if (period_label) {
            period_label.textContent = localize.textContractPeriod;
        }

        var amount_per_point_label = document.getElementById('amount_per_point_label');
        if (amount_per_point_label) {
            amount_per_point_label.textContent = localize.textAmountPerPoint;
        }

        var stop_loss_label = document.getElementById('stop_loss_label');
        if (stop_loss_label) {
            stop_loss_label.textContent = localize.textStopLoss;
        }

        var stop_profit_label = document.getElementById('stop_profit_label');
        if (stop_profit_label) {
            stop_profit_label.textContent = localize.textStopProfit;
        }

        var stop_type_label = document.getElementById('stop_type_label');
        if (stop_type_label) {
            stop_type_label.textContent = localize.textStopType;
        }

        var stop_type_points = document.getElementById('stop_type_points_label');
        if (stop_type_points) {
            stop_type_points.textContent = localize.textStopTypePoints;
        }

        var indicative_barrier_tooltip = document.getElementById('indicative_barrier_tooltip');
        if (indicative_barrier_tooltip) {
            indicative_barrier_tooltip.setAttribute('title', localize.textIndicativeBarrierTooltip);
        }

        var indicative_high_barrier_tooltip = document.getElementById('indicative_high_barrier_tooltip');
        if (indicative_high_barrier_tooltip) {
            indicative_high_barrier_tooltip.setAttribute('title', localize.textIndicativeBarrierTooltip);
        }

        var indicative_low_barrier_tooltip = document.getElementById('indicative_low_barrier_tooltip');
        if (indicative_low_barrier_tooltip) {
            indicative_low_barrier_tooltip.setAttribute('title', localize.textIndicativeBarrierTooltip);
        }

        var jpbarrier_label = document.getElementById('jbarrier_label');
        if (jpbarrier_label) {
            jpbarrier_label.textContent = localize.textExercisePeriod;
        }

        var jpbarrier_high_label = document.getElementById('jbarrier_high_label');
        if (jpbarrier_high_label) {
            jpbarrier_high_label.textContent = localize.textHighBarrier;
        }

        var jpbarrier_low_label = document.getElementById('jbarrier_low_label');
        if (jpbarrier_low_label) {
            jpbarrier_low_label.textContent = localize.textLowBarrier;
        }
    };

    var statementTranslation = function(){
        var titleElement = document.getElementById("statement-title").firstElementChild;
        titleElement.textContent = localize.textStatement;
    };
    
    var profitTableTranslation = function(){
        var titleElement = document.getElementById("profit-table-title").firstElementChild;
        titleElement.textContent = localize.textProfitTable;
    };

    var limitsTranslation = function(){
        var titleElement = document.getElementById("limits-title").firstElementChild;
        titleElement.textContent = localize.textLimits;
        
        var tradingLimits = document.getElementById("trading-limits");
        tradingLimits.textContent = TUser.get().loginid + " - " + localize.textTradingLimits;
        
        var withdrawalTitle = document.getElementById("withdrawal-title");
        withdrawalTitle.textContent = TUser.get().loginid + " - " + localize.textWithdrawalTitle;
    };

    var errorMessage = function(messageType, param){
        var msg = "",
            separator = ', ';
        switch(messageType){
            case 'req':
                msg = localize.textMessageRequired;
                break;
            case 'reg':
                if(param)
                    msg = localize.textMessageJustAllowed.replace('%ALLOWED%', param.join(separator));
                break;
            case 'range':
                if(param)
                    msg = localize.textMessageCountLimit.replace('%LIMIT%', param);
                break;
            default:
                break;
        }
        return msg;
    };

    return {
        localize: function () { return localize; },
        populate: populate,
        statementTranslation: statementTranslation,
        profitTableTranslation: profitTableTranslation,
        limitsTranslation: limitsTranslation,
        errorMessage: errorMessage
    };

})();
