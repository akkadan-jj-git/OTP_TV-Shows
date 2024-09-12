/**
* @NApiVersion 2.1
* @NScriptType ClientScript
*/
define(['N/url', 'N/currentRecord'], function (url, currentRecord) {
 
    function pageInit(scriptContext) {
        window.onbeforeunload = null;
    }
    function searchTVShow() {
        let rec = currentRecord.get();
        let showName = rec.getValue({
            fieldId: 'custpage_showname'
        });
        let suiteletUrl = url.resolveScript({
            scriptId: 'customscript_jj_sl_tv_shows_api',
            deploymentId: 'customdeploy_jj_sl_tv_shows_api',
            params: {
                show: showName
            }
        });
        window.location.href = suiteletUrl;
    }
 
    return {
        pageInit: pageInit,
        searchTVShow: searchTVShow
    };
 
});