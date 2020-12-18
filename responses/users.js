

function usersResponse(data, res) {

    const result = {}
    result['errors'] = ('errors' in data) ? data['errors'] : false;
    result['status'] = ('status' in data) ? data['status'] : false;
    result['db'] = ('db' in data) ? data['db'] : '';
    res.json(result);

}

module.exports = usersResponse;