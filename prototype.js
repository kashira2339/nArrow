String.prototype.startsWith = function(prefix){
    return (this.lastIndexOf(prefix, 0) === 0);
};

String.prototype.isEmpty = function(){
    return (this === null || this === '');
};

