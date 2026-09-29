import { Files } from "lucide-react";
import {create} from "zustand"

const useCsvStore = create((set)=>({
    files :[],
    isCsvSelected : false,
    billcodeRowCount:0,
    loading:false,
    stepCount : 0 ,
    incrementSetCount : ()=>set((state)=>({stepCount : state +1})),
    decrementStepCount :()=> set((state)=> ({stepCount :state -1 })),
    setbillCodeRowCont : (value)=>
    set({
        billcodeRowCount :value
    }),
    setCsvSelected: (value) =>
    set({
      isCsvSelected: value,
    }),
    ///update function
    addCsv : (newfiles)=>
        set((state)=>({
            files: [...state.files, 
               ... (Array.isArray(newfiles)? newfiles : [newfiles])
            ],
    }))
}));

export default useCsvStore;

