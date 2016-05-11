exports.BaseAction = function on(){
    this.callback = null;
    this.query = null;
    this.postData = null;
    this.cookies = null;
    this.excute = function on(callback) {};
    return this;
}