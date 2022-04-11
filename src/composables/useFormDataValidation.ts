import { type Ref, ref, watch } from 'vue';
import useForm, { type Props } from 'ant-design-vue/lib/form/useForm';

export default (data: Props | Ref<Props>, rules: Props) => {
  const valid = ref(false);

  const { validate } = useForm(data, rules);

  watch(data, async () => {
    try {
      await validate();
      valid.value = true;
    } catch {
      valid.value = false;
    }
  }, { deep: true });

  return {
    valid,
  };
};
