'use client';

import css from './NoteForm.module.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../lib/api';
import { Note } from '../../types/note';
import Joi, { ValidationError } from 'joi';

export type NoteFormProps = {
  onClose: () => void;
};

const validationSchema = Joi.object({
  title: Joi.string().min(3).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Must be at least 3 characters',
  }),
  content: Joi.string().max(500).messages({
    'string.max': 'Max 500 characters',
  }),
  tag: Joi.string().valid('Todo', 'Work', 'Personal', 'Meeting', 'Shopping').required(),
});


type ValidationErrors = {
  [key: string]: string;
};

const validateJoi = (values: Record<string, unknown>): ValidationErrors => {
  const { error } = validationSchema.validate(values, { abortEarly: false });
  if (!error) return {};
  return error.details.reduce<ValidationErrors>((acc, curr) => {
    acc[curr.path[0]] = curr.message;
    return acc;
  }, {});
};

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
  });

  return (
    <Formik
      initialValues={{ title: '', content: '', tag: 'Todo' as Note['tag'] }}
      validate={validateJoi} // Валидация через Joi
      onSubmit={(values, { resetForm }) => {
        mutation.mutate(values);
        resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div>
            <Field type="text" name="title" placeholder="Title" />
            <ErrorMessage name="title" component="div" className={css.error} />
          </div>

          <div>
            <Field as="textarea" name="content" placeholder="Content (optional)" />
            <ErrorMessage name="content" component="div" className={css.error} />
          </div>

          <div>
            <Field as="select" name="tag">
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="div" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="submit" disabled={isSubmitting || mutation.isPending}>
              {mutation.isPending ? 'Loading' : 'Save'}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>

          {mutation.isError && (
            <div className={css.error}>Failed to save note. Try again.</div>
          )}
        </Form>
      )}
    </Formik>
  );
}
