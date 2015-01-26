String.prototype.startsWith = function(prefix){
    return (this.lastIndexOf(prefix, 0) === 0);
};

String.prototype.isEmpty = function(){
    return (this === null || this === '');
};

String.prototype.withoutWhiteSpace = function(){
    return this.replace(/\s+/g, '');
};

String.prototype.endsWith = function(prefix){
    return this.substr(this.length - prefix.length) === prefix;
};

HTMLElement.prototype.append = function(element){
    this.appendChild(typeof element === 'string' ?
        document.createTextNode(element) : element);
};

HTMLElement.prototype.remove = function(element){
    this.removeChild(element);
};

NodeList.prototype.forEach = function(obj, func){
    Array.prototype.forEach.call(obj, func(x));
};