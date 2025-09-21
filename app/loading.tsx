'use client';
 
import css from './loading.module.css';

export default function Loading() {
  
 

  return (
    <div className={css.loadingContainer}>
      <div className={css.spinner}></div>
    </div>
  );
}