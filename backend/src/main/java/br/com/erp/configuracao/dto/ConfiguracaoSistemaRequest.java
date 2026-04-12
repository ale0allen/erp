package br.com.erp.configuracao.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record ConfiguracaoSistemaRequest(

        @NotBlank(message = "Razão social é obrigatória.")
        @Size(max = 255)
        String companyName,

        @Size(max = 255)
        String tradeName,

        @Pattern(regexp = "^$|^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", message = "E-mail inválido.")
        String companyEmail,

        @Size(max = 50)
        String companyPhone,

        @NotBlank(message = "Código da moeda é obrigatório.")
        @Size(max = 10)
        String currencyCode,

        @NotBlank(message = "Fuso horário é obrigatório.")
        @Size(max = 100)
        String timezone,

        @NotNull(message = "Tamanho de página é obrigatório.")
        @Positive(message = "Tamanho da página deve ser maior que zero.")
        Integer defaultPageSize,

        @NotNull(message = "Limite de estoque baixo é obrigatório.")
        @Min(value = 0, message = "Limite de estoque baixo não pode ser negativo.")
        Integer lowStockDefaultThreshold,

        @Size(max = 4000)
        String additionalInfo
) {
}
