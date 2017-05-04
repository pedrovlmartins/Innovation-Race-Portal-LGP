$(document).ready(function() {
        $('[data-toggle="tooltip"]').tooltip();
    }
);

function focusTextarea(label, gly) {
    $(document).ready(function() {
        $(label).hide();
        $(gly).hide();
    });
}

function focusoutTextarea(textarea, label, gly) {
    $(document).ready(function() {
        if (document.getElementById(textarea).value) {
            $(label).hide();
            $(gly).hide();
        } else {
            $(label).show();
            $(gly).show();
        }
    });
}

$('document').ready(function() {
    $('#keyPartnersTextarea').focus(function() {
        focusTextarea('#keyPartnersLabel', '#keyPartnersGly');
    });
    $('#keyActivitiesTextarea').focus(function() {
        focusTextarea('#keyActivitiesLabel', '#keyActivitiesGly');
    });
    $('#keyResourcesTextarea').focus(function() {
        focusTextarea('#keyResourcesLabel', '#keyResourcesGly');
    });
    $('#keyValueTextarea').focus(function() {
        focusTextarea('#keyValueLabel', '#keyValueGly');
    });
    $('#keyCostumerTextarea').focus(function() {
        focusTextarea('#keyCostumerLabel', '#keyCostumerGly');
    });
    $('#keyChannelsTextarea').focus(function() {
        focusTextarea('#keyChannelsLabel', '#keyChannelsGly');
    });
    $('#keySegmentsTextarea').focus(function() {
        focusTextarea('#keySegmentsLabel', '#keySegmentsGly');
    });
    $('#keyCostTextarea').focus(function() {
        focusTextarea('#keyCostLabel', '#keyCostGly');
    });
    $('#keyRevenueTextarea').focus(function() {
        focusTextarea('#keyRevenueLabel', '#keyRevenueGly')
    });

    // focus out //

    $('#keyPartnersTextarea').focusout(function() {
        focusoutTextarea('keyPartnersTextarea', '#keyPartnersLabel', '#keyPartnersGly');
    });
    $('#keyActivitiesTextarea').focusout(function() {
        focusoutTextarea('keyActivitiesTextarea', '#keyActivitiesLabel', '#keyActivitiesGly');
    });
    $('#keyResourcesTextarea').focusout(function() {
        focusoutTextarea('keyResourcesTextarea', '#keyResourcesLabel', '#keyResourcesGly');
    });
    $('#keyValueTextarea').focusout(function() {
        focusoutTextarea('keyValueTextarea', '#keyValueLabel', '#keyValueGly');
    });
    $('#keyCostumerTextarea').focusout(function() {
        focusoutTextarea('keyCostumerTextarea', '#keyCostumerLabel', '#keyCostumerGly');
    });
    $('#keyChannelsTextarea').focusout(function() {
        focusoutTextarea('keyChannelsTextarea', '#keyChannelsLabel', '#keyChannelsGly');
    });
    $('#keySegmentsTextarea').focusout(function() {
        focusoutTextarea('keySegmentsTextarea', '#keySegmentsLabel', '#keySegmentsGly');
    });
    $('#keyCostTextarea').focusout(function() {
        focusoutTextarea('keyCostTextarea', '#keyCostLabel', '#keyCostGly');
    });
    $('#keyRevenueTextarea').focusout(function() {
        focusoutTextarea('keyRevenueTextarea', '#keyRevenueLabel', '#keyRevenueGly')
    });
});