/**
* @NApiVersion 2.1
* @NScriptType Suitelet
*/
define(['N/ui/serverWidget', 'N/https'],
    (serverWidget, https) => {
 
        const onRequest = (scriptContext) => {
            try {
                if (scriptContext.request.method === 'GET') {
                    let form = serverWidget.createForm({
                        title: 'Find TV Shows'
                    });
                    let group1 = form.addFieldGroup({
                        id: 'custpage_searchbar',
                        label: 'Search Bar'
                    });
                    let find = form.addField({
                        id: 'custpage_showname',
                        label: 'Enter a TV Show name',
                        type: serverWidget.FieldType.TEXT,
                        container: 'custpage_searchbar'
                    });
                    let showName = scriptContext.request.parameters.show;
                    if (showName) {
                        find.defaultValue = showName;
                    }
                    form.addButton({
                        id: 'custpage_search',
                        label: 'Search',
                        functionName: 'searchTVShow'
                    });
                    let subList = form.addSublist({
                        id: 'custpage_sublist1',
                        label: 'Related Shows',
                        type: serverWidget.SublistType.STATICLIST,
                        container: 'custpage_searchbar'
                    });
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
                        type: serverWidget.FieldType.URL
                    });
                    if (showName) {
                        let apiUrl = 'https://api.tvmaze.com/search/shows?q={' + encodeURIComponent(showName) + '}';
                        log.debug("apiUrl",apiUrl)
                        let response = https.get({
                            url: apiUrl
                        });
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
                    form.clientScriptModulePath = './jj_cs_Set URL Parameter for TV show.js';
 
                } else if (scriptContext.request.method === 'POST') {
                    let name = scriptContext.request.parameters.custpage_showname;
                    log.debug('Search Keyword', name);
                }
            } catch (e) {
                log.debug('Error@onRequest', e.message + e.stack);
            }
        };
 
        return { onRequest };
 
    });