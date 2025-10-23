import CategoryBusiness from "../enums/CategoryBusiness";

type PartialAllBusinessResponseDto = {
    id: string;
    businessId: string;
    category: CategoryBusiness;
    title: string | null;
    number: string;
  };
  
  export default PartialAllBusinessResponseDto;
  