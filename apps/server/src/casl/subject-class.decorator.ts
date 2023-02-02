import StaticImplements from 'src/utils/static-implements.decorator';

/** A decorator that forces class to implement modelName static property. */
export default function SubjectClass() {
  return StaticImplements<{
    /** https://casl.js.org/v6/en/advanced/typescript#infer-subject-types-from-interfaces-and-classes */
    get modelName(): string;
  }>();
}
