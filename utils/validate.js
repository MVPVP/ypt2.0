export const validata={
    idCard:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    valid_idCard:function(val){
        return this.idCard.test(val);
    }
}