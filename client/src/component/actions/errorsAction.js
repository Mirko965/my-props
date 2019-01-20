export const clearErrors = () => ({
  type:'CLEAR_ERRORS',
  errors:{}
})
export const getErrors = (err) => ({
  type:'GET_ERRORS',
  errors:err.response.data
})
