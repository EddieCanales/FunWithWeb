(function(){
  'use strict';

  angular.module('health-guide')
         .service('healthGuideService', ['$q', '$sce', HealthGuideService]);

  /**
   * HealthGuide DataService
   *
   * @returns {{load: Function}}
   * @constructor
   */
  function HealthGuideService($q, $sce){

    var categoryClasses = {
        'Science': 'md-warn',
        'Leisure': 'md-accent md-hue-2',
        'Business': 'md-primary md-hue-1'
    };

    // Promise-based API
    return {
        load : function() {
            var deferredLoad = $q.defer();
            console.log('loading via yql!');

            var parsePapers = function(data) {
                var papers = _.chain(data.query.results.item).map(function(paper){
                    paper.pubDate = new Date(paper.pubDate);
                    paper.description = paper.description.replace(/<br\/>Tweeted by .*$/,'');
                    paper.categoryClass = categoryClasses[paper.category] || 'md-accent md-hue-1';
                    return paper;
                }).sortByOrder(['pubDate'],['desc']).value();
                return papers;
            };

            // var parsePapersApi = function(data) {
            //     var edition = data.query.results.json.data.edition;
            //     console.log('loaded data in API callback', edition);
            //     var papers = _.chain(edition.headlines).map(function(paper){
            //         paper.pubDate = new Date(paper.source.timestamp);
            //         paper.description = paper.content.replace(/<br\/>Tweeted by .*$/,'');
            //         paper.categoryClass = categoryClasses[paper.category] || 'md-accent md-hue-1';
            //         return paper;
            //     }).sortByOrder(['pubDate'],['desc']).value();
            //     return papers;
            // };

            window.hgsCallback = function(data) {
                console.log('loaded data in callback', data);
                deferredLoad.resolve(parsePapers(data));
            };
            // window.hgsApiCallback = function(data) {
            //     deferredLoad.resolve(parsePapersApi(data));
            // };
            //http://paper.li/~api/papers/a5db33f6-3f44-46a6-8e1e-de91a20e0419
            angular.element('body').append(
                angular.element(
                    '<script src="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22http%3A%2F%2Fpaper.li%2F~api%2Fpapers%2Fa5db33f6-3f44-46a6-8e1e-de91a20e0419%2Frss%22&format=json&diagnostics=true&callback=hgsCallback"></script>'
                )
            );
            // angular.element('body').append(
            //     angular.element(
            //         '<script src="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22http%3A%2F%2Fpaper.li%2F~api%2Fpapers%2Fa5db33f6-3f44-46a6-8e1e-de91a20e0419%22&format=json&diagnostics=true&callback=hgsApiCallback"></script>'
            //     )
            // );
            return deferredLoad.promise;
        }
    };
  }

})();
