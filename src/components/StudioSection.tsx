import type {ReactNode} from 'react';
import {ChevronDown} from 'lucide-react';
export function StudioSection({title,description,children,initialOpen=false}:{title:string;description?:string;children:ReactNode;initialOpen?:boolean}){return <details className="studio-section" open={initialOpen||undefined}><summary><span><strong>{title}</strong>{description?<small>{description}</small>:null}</span><ChevronDown aria-hidden="true"/></summary><div className="studio-section-content">{children}</div></details>;}
