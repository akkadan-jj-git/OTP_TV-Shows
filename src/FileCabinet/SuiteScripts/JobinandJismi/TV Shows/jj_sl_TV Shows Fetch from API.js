/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/url', 'N/redirect', 'N/https'],
    /**
 * @param{serverWidget} serverWidget
 */
    (serverWidget, url, redirect, https) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try{
                if(scriptContext.request.method === 'GET'){
                    let form = serverWidget.createForm({
                        title: 'Find TV Shows'
                    });
                    let group1 = form.addFieldGroup({
                        id: 'custpage_searchbar',
                        label: 'Search Bar'
                    })
                    let find = form.addField({
                        id: 'custpage_showname',
                        label: 'Enter a TV Show name',
                        type: serverWidget.FieldType.TEXT,
                        container: 'custpage_searchbar'
                    });
                    let subList = form.addSublist({
                        id: 'custpage_sublist1',
                        label: 'Related Shows',
                        type: serverWidget.SublistType.STATICLIST,
                        container: 'custpage_searchbar'
                    })
    
                    subList.addField({
                        id: 'custpage_name',
                        label: 'Name',
                        type: serverWidget.FieldType.TEXT
                    });
                    subList.addField({
                        id: 'custpage_type',
                        label: 'Type',
                        type: serverWidget.FieldType.TEXT
                    });
                    subList.addField({
                        id: 'custpage_language',
                        label: 'Language',
                        type: serverWidget.FieldType.TEXT
                    });
                    subList.addField({
                        id: 'custpage_url',
                        label: 'URL',
                        type: serverWidget.FieldType.TEXT
                    });
                    let submit = form.addSubmitButton({
                        label: 'Search Shows'
                    });
                    if(scriptContext.request.parameters.show) {
                        let showName = scriptContext.request.parameters.show;
                        // API Call to fetch TV shows based on the search query
                        let apiUrl = 'https://api.tvmaze.com/search/shows?q=' + encodeURIComponent(showName);
                        let response = https.get({
                            url: apiUrl
                        });
                        log.debug('URL response', response);
        
                        if (response.code === 200) {
                            let shows = JSON.parse(response.body);
                            for (let i = 0; i < shows.length; i++) {
                                subList.setSublistValue({
                                    id: 'custpage_name',
                                    line: i,
                                    value: shows[i].show.name || ''
                                });
                                subList.setSublistValue({
                                    id: 'custpage_type',
                                    line: i,
                                    value: shows[i].show.type || ''
                                });
                                subList.setSublistValue({
                                    id: 'custpage_language',
                                    line: i,
                                    value: shows[i].show.language || ''
                                });
                                subList.setSublistValue({
                                    id: 'custpage_url',
                                    line: i,
                                    value: shows[i].show.url || ''
                                });
                            }
                        }
                    }
                    scriptContext.response.writePage(form);
                }
                else if(scriptContext.request.method === 'POST'){
                    let name = scriptContext.request.parameters.custpage_showname;
                    log.debug('Search Keyword', name);
                    // let redirectUrl = url.resolveScript({
                    //     scriptId: 'customscript_jj_sl_tv_shows_api',
                    //     deploymentId: 'customdeploy_jj_sl_tv_shows_api',
                    //     params: { show: name }
                    // });
                    scriptContext.response.sendRedirect({
                        type: https.RedirectType.SUITELET,
                        identifier: 'customscript_jj_sl_tv_shows_api',
                        deploymentId: 'customdeploy_jj_sl_tv_shows_api',
                        parameters: { show: name }
                    });
                }
            }
            catch(e){
                log.debug('Error@onRequest', e.message + e.stack);
            }
        }

        return {onRequest}

    });
