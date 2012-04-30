var LocalMap = function(name){

    var buffer = null;

    var initMap = function(){
        if(!localStorage[name]){
            localStorage[name] = JSON.stringify({});
        }
    }

    var setMap = function(map){
        localStorage[name] = JSON.stringify(map);
    };

    this.getMap = function(){
        return (localStorage[name])? JSON.parse(localStorage[name]) : {};
    }

    this.set = function(name, object){
        var map = this.getMap();
        map[name] = object;
        setMap(map);
    };

    this.get = function(name){
        var map = this.getMap();
        return (map[name]) ? map[name] : null;
    };

    this.length = function(){
        var map = this.getMap();
        var size = 0, key;

        for (key in map) {
            if (map.hasOwnProperty(key)) size++;
        }

        return size;

    };

    this.erase = function(){
        localStorage[name] = JSON.stringify({});
    };

    this.isSet = function(name){
        return this.get(name) != null;
    }

    this.release = function(name){
        var map = this.getMap();
        if(map[name])
            delete map[name];
        setMap(map);
    };


    initMap();

}

LocalMap.destroy = function(){
    for(item in localStorage)
        delete localStorage[item];
};

LocalMap.exists = function(name){
    return (localStorage[name]) ? true : false;
}