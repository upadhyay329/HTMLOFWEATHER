 public with sharing class CustomLookupController {
    @AuraEnabled(Cacheable = True)
    public Static List<SObject> FetchLookupData(String SearchKey, String ObjectApiName) {
        List<Sobject> sobjectList = new List<Sobject>();
        if(String.isBlank(SearchKey)){
            return sobjectList;
        } else{
            String Key = '%' + SearchKey +'%';
        String Query = 'select Id, Name from ' + ObjectAPiName + ' Where Name like :key order by Name Limit 5' ;
        sObjectList = Database.query(query, AccessLevel.USER_MODE);  
        return sObjectList;  
      }
        }

    }
