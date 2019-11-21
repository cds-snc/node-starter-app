/* istanbul ignore file */

const Schema = {
  box_type: {
    custom: {
      options: (value, { req }) => {

        if(!req.body.box_type){
          req.body.box_type = []
        }
        //
        return true
      },
    },
  },
}

module.exports = {
  Schema,
}
