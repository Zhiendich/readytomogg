import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export function validateEnv<T extends object>(
  config: Record<string, string | undefined>,
  envVariablesClass: ClassConstructor<T>,
) {
  const validatedConfig = plainToInstance(envVariablesClass, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessage = errors
      .map(
        (error) =>
          `\n Error in ${error.property} : \n` +
          Object.entries(error.constraints ?? {})
            .map(([key, value]) => `+ ${key} : ${value}`)
            .join('\n'),
      )
      .join('\n');

    console.error(`\n ${errors.toString()}`);

    throw new Error(errorMessage);
  }
  return validatedConfig;
}
