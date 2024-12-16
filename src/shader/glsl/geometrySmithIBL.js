import { glsl } from "../../gl/shader";

export default glsl`
float geometrySchlickGGXIBL(float NdotV, float a) {
    // note that we use a different k for IBL
    float k = (a * a) / 2.0;

    float nom   = NdotV;
    float denom = NdotV * (1.0 - k) + k;

    return nom / denom;
}

float geometrySmithIBL(vec3 N, vec3 V, vec3 L, float roughness) {
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx2 = geometrySchlickGGXIBL(NdotV, roughness);
    float ggx1 = geometrySchlickGGXIBL(NdotL, roughness);

    return ggx1 * ggx2;
}
`
