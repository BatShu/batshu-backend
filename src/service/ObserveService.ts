import ObserveRepository from "../Repository/ObserveRepository";


exports.readObserveOnTheMap = async (locationObject:LocationObject) => {
    try{
    const observeRows = await ObserveRepository.selectObserveOnTheMapRow(locationObject) as ResultSetHeader[];
    
    const data:ObserveLocationObject[] = []
    
    for (let observeRow of observeRows){
        const location:LocationObject = {
            x : observeRow.x,
            y : observeRow.y
        }
        const observeLocationObject:ObserveLocationObject = {
            observeId: observeRow.id,
            observeLocation: location
        };
        data.push(observeLocationObject);
    }

    const resData = {
        ok: true,
        msg: "Successfully Get",
        data: data
    } 
    return resData;

    }  catch (error) {
        const resData: ApiResponse = {
            ok: false,
            msg: "INTERNAL SERVER ERROR"
        }
        return resData;
    }
}